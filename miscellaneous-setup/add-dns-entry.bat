@echo off
rem this adds a dns entry for www.exquizit.com
rem Author: Jin Kuan
if "%1"=="" goto err
set host_location=C:\Windows\System32\drivers\etc\hosts

rem remove any lines with nspproject.exquizit.com in them
type %host_location% | findstr /v  "nspproject.exquizit.com" > %host_location%

rem add nspproject entry
set "name=nspproject.exquizit.com"
set "ip=%1%"
set "dns_entry=%ip%    %name%"
echo %dns_entry% >> %host_location%
goto end

:err
echo (Usage: add-dns-entry.bat <ip address>)
goto end

:end
