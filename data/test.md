FORMAT: 1A

# Group Authentication

Polls is a simple API allowing consumers to view polls and vote in them.

# /auth

## Get question by id [GET /{question_id}]
+ Parameters
    + question_id (number) - ID of the Question in the form of an integer
        (numeric)
+ Request (application/json)
    + Attributes
        + id (number,required) - auth part (range 10 100, pair)

+ Response 200 (text/plain; charset=utf-8)

        Hello, world!

## register [POST /register]

You may create your own question using this action. It takes a JSON object
containing a question and a collection of answers in the form of choices.

+ auth (Email Creds) - auth part
+ user (User Info) - user data

+ Request (application/json)
    + Attributes
        + auth (Email Creds) - auth part
        + user (User Info) - user data



+ Response 201 (application/json)
    + Attributes (Auth Response)
+ Response 400
+ Response 401
+ Response 500


## login [POST /login]
    (authorized)
+ Request (application/json)
    + Attributes (Email Creds)
+ Response 200 (application/json)
    + Attributes (Auth Response)
+ Response 400

## change password [POST /password]
    [authorized]
+ Request (application/json)
    + Attributes
        + current_password: pass12345 (string,required)
          description  (min 8,max 20)
        + new_password: newpass12345 (string,required)
            (min 8,max 20)
            Password should be at least 8 characters & less than 10 characters
+ Response 204
+ Response 401
+ Response 400
+ Response 500


# Data Structures
## Email Creds (object)
+ email: test@test.com (string, required)
    (email)
+ password: pass12345 (string, required)

## User Info (object)
+ first_name: John (string,required)
    (min 10,max 100)
+ last_name: Doe (string,required)
+ birth_date: 01-12-1980 (string)
+ birth_place: Gotham (string)

## Auth Response (object)
+ token: SOME_TOKEN (string)
+ user_id: 11 (number)
    (range 10 100)
+ email (Email Creds,required)