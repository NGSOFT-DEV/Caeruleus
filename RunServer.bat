SET SRC_DIR=build
SET HTTP_DIR=node_modules\http-server\bin
SET PORT=8020

node %HTTP_DIR%\http-server %SRC_DIR% -p %PORT%