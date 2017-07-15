@echo off
rem this adds a dns entry for www.exquizit.com
rem Author: Jin Kuan
set host_location=C:\Windows\System32\drivers\etc\hosts

rem remove any lines with nspproject.exquizit.com in them
type %host_location% | findstr /v  nspproject.exquizit.com > %host_location%

set "name=nspproject.exquizit.com"
set "ip=%1%"
set "dns_entry=%name%    %ip%"
echo %dns_entry% >> %host_location%
