import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для сохранения и загрузки прогресса пользователя"""
    
    method = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers_response = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        # Получаем user_id из заголовков или создаём уникальный
        user_id = event.get('headers', {}).get('X-User-Id') or event.get('headers', {}).get('x-user-id')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': headers_response,
                'body': json.dumps({'error': 'User ID is required'}),
                'isBase64Encoded': False
            }
        
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            # Загрузка прогресса
            cursor.execute(
                "SELECT * FROM user_progress WHERE user_id = %s",
                (user_id,)
            )
            row = cursor.fetchone()
            
            if row:
                result = {
                    'totalXP': row['total_xp'],
                    'level': row['level'],
                    'streak': row['streak'],
                    'subjects': row['subjects'],
                    'webinarsWatched': row['webinars_watched'],
                    'videosWatched': row['videos_watched'],
                    'tasksCompleted': row['tasks_completed'],
                    'mockTestsCompleted': row['mock_tests_completed'],
                    'mockTests': row['mock_tests'],
                    'achievements': row['achievements'],
                    'lastSaved': row['updated_at'].isoformat()
                }
            else:
                result = {'message': 'No progress found'}
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers_response,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' or method == 'PUT':
            # Сохранение прогресса
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO user_progress (
                    user_id, total_xp, level, streak, subjects,
                    webinars_watched, videos_watched, tasks_completed,
                    mock_tests_completed, mock_tests, achievements
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id) DO UPDATE SET
                    total_xp = EXCLUDED.total_xp,
                    level = EXCLUDED.level,
                    streak = EXCLUDED.streak,
                    subjects = EXCLUDED.subjects,
                    webinars_watched = EXCLUDED.webinars_watched,
                    videos_watched = EXCLUDED.videos_watched,
                    tasks_completed = EXCLUDED.tasks_completed,
                    mock_tests_completed = EXCLUDED.mock_tests_completed,
                    mock_tests = EXCLUDED.mock_tests,
                    achievements = EXCLUDED.achievements,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
            """, (
                user_id,
                body.get('totalXP', 0),
                body.get('level', 1),
                body.get('streak', 0),
                json.dumps(body.get('subjects', [])),
                body.get('webinarsWatched', 0),
                body.get('videosWatched', 0),
                body.get('tasksCompleted', 0),
                body.get('mockTestsCompleted', 0),
                json.dumps(body.get('mockTests', [])),
                json.dumps(body.get('achievements', []))
            ))
            
            conn.commit()
            row = cursor.fetchone()
            
            result = {
                'message': 'Progress saved successfully',
                'lastSaved': row['updated_at'].isoformat()
            }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers_response,
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers_response,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers_response,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
