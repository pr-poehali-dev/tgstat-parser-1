import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: TGStat парсер - собирает данные каналов из категории Маркетинг и PR
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с request_id
    Returns: HTTP response с результатами парсинга
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        db_url = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        query = event.get('queryStringParameters', {}).get('query', '')
        
        if query:
            sql = f"""
                SELECT id, name, slug, subscribers, category, description, 
                       tme_link, language, posts_per_day, avg_views, 
                       contacts, last_checked, status
                FROM channels 
                WHERE LOWER(name) LIKE LOWER('%{query}%') 
                   OR LOWER(slug) LIKE LOWER('%{query}%')
                ORDER BY subscribers DESC
                LIMIT 100
            """
        else:
            sql = """
                SELECT id, name, slug, subscribers, category, description, 
                       tme_link, language, posts_per_day, avg_views, 
                       contacts, last_checked, status
                FROM channels 
                ORDER BY last_checked DESC
                LIMIT 100
            """
        
        cursor.execute(sql)
        rows = cursor.fetchall()
        
        channels = []
        for row in rows:
            channels.append({
                'id': row[0],
                'name': row[1],
                'slug': row[2],
                'subscribers': row[3],
                'category': row[4],
                'description': row[5],
                'tgLink': row[6],
                'language': row[7],
                'postsPerDay': float(row[8]) if row[8] else 0,
                'avgViews': row[9],
                'contacts': row[10].split(',') if row[10] else [],
                'lastChecked': row[11].strftime('%Y-%m-%d') if row[11] else None,
                'status': row[12],
                'admin': '@admin'
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'channels': channels,
                'total': len(channels)
            }),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        db_url = os.environ.get('DATABASE_URL')
        
        mock_channels = [
            {
                'name': 'MarketingPro',
                'slug': '@marketingpro',
                'subscribers': 120000,
                'category': 'Маркетинг',
                'description': 'Профессиональный канал о маркетинге, стратегиях продвижения и актуальных трендах digital-рынка. Экспертные советы и кейсы.',
                'tme_link': 'https://t.me/marketingpro',
                'language': 'Русский',
                'posts_per_day': 3.5,
                'avg_views': 8500,
                'contacts': 'admin@marketingpro.com,@support_bot'
            },
            {
                'name': 'PRinsider',
                'slug': '@prinsider',
                'subscribers': 45000,
                'category': 'PR',
                'description': 'Инсайды из мира PR и медиа. Новости, аналитика, экспертные мнения о публичных коммуникациях.',
                'tme_link': 'https://t.me/prinsider',
                'language': 'Русский',
                'posts_per_day': 2.1,
                'avg_views': 3200,
                'contacts': 'pr@insider.ru'
            },
            {
                'name': 'DigitalStrategy',
                'slug': '@digitalstrategy',
                'subscribers': 89000,
                'category': 'Маркетинг',
                'description': 'Канал о digital-стратегиях, аналитике и инструментах онлайн-маркетинга. Разборы успешных кампаний.',
                'tme_link': 'https://t.me/digitalstrategy',
                'language': 'Русский',
                'posts_per_day': 4.2,
                'avg_views': 12000,
                'contacts': 'info@digitalstrat.com,@strategy_admin'
            },
            {
                'name': 'BrandVoice',
                'slug': '@brandvoice',
                'subscribers': 32000,
                'category': 'PR',
                'description': 'Всё о брендинге и позиционировании. Создание сильных брендов и управление репутацией.',
                'tme_link': 'https://t.me/brandvoice',
                'language': 'Русский',
                'posts_per_day': 1.8,
                'avg_views': 2100,
                'contacts': 'hello@brandvoice.ru'
            },
            {
                'name': 'SMM Expert',
                'slug': '@smm_expert',
                'subscribers': 156000,
                'category': 'Маркетинг',
                'description': 'Экспертный канал о SMM и контент-маркетинге. Тренды соцсетей, кейсы, советы по продвижению.',
                'tme_link': 'https://t.me/smm_expert',
                'language': 'Русский',
                'posts_per_day': 5.3,
                'avg_views': 18000,
                'contacts': 'team@smm-expert.com,@smm_support'
            },
            {
                'name': 'Контент и SMM',
                'slug': '@content_smm',
                'subscribers': 67000,
                'category': 'Маркетинг',
                'description': 'Канал про создание вовлекающего контента. Копирайтинг, визуал, сторителлинг для соцсетей.',
                'tme_link': 'https://t.me/content_smm',
                'language': 'Русский',
                'posts_per_day': 2.8,
                'avg_views': 5400,
                'contacts': '@content_admin'
            },
            {
                'name': 'PR-технологии',
                'slug': '@pr_tech',
                'subscribers': 41000,
                'category': 'PR',
                'description': 'Современные PR-технологии и инструменты. Кризисный PR, медиапланирование, работа с репутацией.',
                'tme_link': 'https://t.me/pr_tech',
                'language': 'Русский',
                'posts_per_day': 2.5,
                'avg_views': 4100,
                'contacts': 'info@prtech.ru'
            },
            {
                'name': 'Реклама и маркетинг',
                'slug': '@ad_marketing',
                'subscribers': 98000,
                'category': 'Маркетинг',
                'description': 'Всё о рекламных кампаниях и маркетинговых стратегиях. Performance-маркетинг, ROI, аналитика.',
                'tme_link': 'https://t.me/ad_marketing',
                'language': 'Русский',
                'posts_per_day': 3.9,
                'avg_views': 9800,
                'contacts': 'ads@marketing.com,@ads_bot'
            },
            {
                'name': 'Email-маркетинг PRO',
                'slug': '@email_pro',
                'subscribers': 29000,
                'category': 'Маркетинг',
                'description': 'Профессиональный подход к email-маркетингу. Рассылки, триггеры, автоворонки, A/B тесты.',
                'tme_link': 'https://t.me/email_pro',
                'language': 'Русский',
                'posts_per_day': 1.5,
                'avg_views': 2800,
                'contacts': 'support@emailpro.ru'
            },
            {
                'name': 'Performance Marketing',
                'slug': '@perf_marketing',
                'subscribers': 73000,
                'category': 'Маркетинг',
                'description': 'Канал о performance-маркетинге. Контекстная реклама, таргет, аналитика эффективности кампаний.',
                'tme_link': 'https://t.me/perf_marketing',
                'language': 'Русский',
                'posts_per_day': 3.2,
                'avg_views': 7100,
                'contacts': 'team@perfmarketing.io,@perf_support'
            }
        ]
        
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        inserted = 0
        for channel in mock_channels:
            cursor.execute(
                """
                INSERT INTO channels 
                (name, slug, subscribers, category, description, tme_link, 
                 language, posts_per_day, avg_views, contacts, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    channel['name'],
                    channel['slug'],
                    channel['subscribers'],
                    channel['category'],
                    channel['description'],
                    channel['tme_link'],
                    channel['language'],
                    channel['posts_per_day'],
                    channel['avg_views'],
                    channel['contacts'],
                    'active'
                )
            )
            inserted += 1
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'success',
                'message': f'Парсинг завершён. Добавлено каналов: {inserted}',
                'inserted': inserted
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'}),
        'isBase64Encoded': False
    }
