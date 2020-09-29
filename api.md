# Endpoints

## 1. Discussion Messages

**URL:** /webapp/discussions/stats

**Method:** POST

**Request Data:** 
```json
{
    "user_id": 12345,
    "discussion_id": 232323,
    "page_num": 1
}
```

**Response Data:**
```json
[
    {
        "id": 2343,
        "app_message_id": 987,
        "sent_date": "2020-09-19T16:51:28.306144Z",
        "last_updated": "2020-09-19T16:51:28.306144Z",
        "content": "my message",
        "sender_id": 576,
        "sender_name": "Itamar",
        "discussions": [
            {
                "id": 444,
                "hashtag": "my_first_hashtag"
            }
        ],
        "reply_to_id": null,
        "hashtags": [
            "my_first_hashtag",
            "another_hashtag"
        ]
    }
]
``` 

## 2. Discussion Summary

**URL:** /webapp/discussions/summary

**Method:** POST

**Request Data:** 
```json
{
    "user_id": 4567,
    "filters": {
        "group_ids" :  [
            1234
        ],
        "app_name" : "telegram",
        "discussion_ids" :  [
            444,
            445
        ],
        "sender_ids" : [
            576,
            577
        ],
        "hashtags" :  [
            "new_hastag",
            "best_hastag_ever"
        ],
        "min_date" : "2020-09-18T16:51:28.306144Z",
        "max_date" :  "2020-09-19T16:51:28.306144Z",
        "freetext_search" : "some text stuff"
    },
    "page_num": 1,
    "page_size": 100
}
```

**Response Data:**
```json
{
    "current_page": 1,
    "total pages": 10,
    "discussions": [
        {
            "discussion_id": 8,
            "discussion_name": "my_discussion_name",
            "group_id": 76767676,
            "message_count": 25,
            "last_updated": "2020-09-19T16:51:28.306144Z",
            "first_message": {
                "id": 5555,
                "app_message_id": 678,
                "sent_date": "2020-09-19T16:51:28.306144Z",
                "last_updated": "2020-09-19T16:51:28.306144Z",
                "content": "abc",
                "sender_id": 777,
                "sender_name": "Roy",
                "discussions": [
                    {
                        "id": 4444,
                        "hashtag": "my_new_ht"
                    }
                ],
                "reply_to_id": 888
            },
            "latest_messages": [
                {
                    "id": 5555,
                    "app_message_id": 678,
                    "sent_date": "2020-09-19T16:51:28.306144Z",
                    "last_updated": "2020-09-19T16:51:28.306144Z",
                    "content": "abc",
                    "sender_id": 777,
                    "sender_name": "Roy",
                    "discussions": [
                        {
                            "id": 4444,
                            "hashtag": "my_new_ht"
                        }
                    ],
                    "reply_to_id": 888
                }
            ]
        }
    ]
}
```

## 3. Group Stats

**URL:** /webapp/apps/groups

**Method:** POST

**Request Data:** 
```json
{
    "user_id": 4567
}
```

**Response Data:**
```json
{
    "app_id": 5676,
    "app_name": "Telegram",
    "groups'": [
        {
            "id": 787,
            "name": "mta_information_systems_2020",
            "last_updated": "2020-09-19T16:51:28.306144Z"
        }
    ]
}
```

## 4. Hashtags

**URL:** /webapp/hashtags

**Method:** POST

**Request Data:** 
```json
{
    "user_id": 4567
}
```

**Response Data:**
```json
{
    "hashtags": [
        "new_hastag",
        "best_hastag_ever"
    ]
}
```

## 5. Register New User

**URL:** /account/register

**Format:** form-data

**Request Fields:** 
```json
[
    "username",
    "email",
    "password1",
    "password2"
]
```

**Response:** HTTP 201

## 6. Register User Created By Bot

**URL:** /account/register/<user_uid>/<token>

###6.1. Method: POST

**Request Data:** 
```json
{
    "username": "my_user",
    "password": "Password1"
}
```

###6.2. Method: GET

**Response Data:**
```json
{
    "expected": {
        "username": "my_user",
        "id": 13
    }
}
```

**Response:** HTTP 201

## 7. Connect User To App

**URL:** /account/add_app/<user_uid>/<token>/<app_id>/<app_user_uid>

**Method:** POST

**Request Data:** 
```json
{ }
```

**Response:** HTTP 201

## 8. Login

**URL:** /account/token

**Method:** POST

**Notes:** Login times out after 24 hours 

**Request Data:** 
```json
{
    "username": "my_user",
    "password": "Password1"
}
```

**Response Data:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwMTQ2MzQ1NCwianRpIjoiYjQzYWE2YzU3ZGE3NDBkZmIxMmZjMGZhMGQ2NjNkY2IiLCJ1c2VyX2lkIjoyfQ.1we6fdo4_WWe6_1eq3VKQn-SDLgXFDrG6-UfbzBOe78",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjAxNDYzNDU0LCJqdGkiOiJjYmUwZmJmODc1YTk0Y2I2YTkyYjFhMTgxZjc1NDQxNCIsInVzZXJfaWQiOjJ9.6JvjBVVWs7dj9w63gNDCaklAEWf4zGxVrJL2wABqMNU"
}
```

## 9. Verify login

**URL:** /account/token/verify

**Method:** POST

**Request Data:** 
```json
{ }
```

**Response:** HTTP 200
