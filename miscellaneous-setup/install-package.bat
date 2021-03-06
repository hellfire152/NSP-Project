@echo off
rem This file installs all the modules our project depends on.
rem Author: Jin Kuan
call npm install socket.io
call npm install express
call npm install express-session
call npm install session-file-store
call npm install https
call npm install shortid
call npm install helmet
call npm install mysql
call npm install crypto
call npm install express-validator
call npm install body-parser
call npm install uuid
call npm install promise
call npm install cookie
call npm install pug
call npm install password-validator
call npm install nodemailer
call npm install mailchecker
call npm install xoauth2
call npm install speakeasy
call npm install base32
call npm install express-rate-limit
call npm install helmet-csp
call npm install csurf
cls
echo All required modules installed!
