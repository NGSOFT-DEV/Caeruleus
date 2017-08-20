pushd %~dp0

call RunDevBuild.bat
call START /b RunServer.bat 
call RunDebugApplication.bat 

popd









