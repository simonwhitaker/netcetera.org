#!/bin/bash

LOCAL_PATH=www
REMOTE_HOST=netcetera.org
REMOTE_PATH=netcetera.org

rsync --recursive --verbose --times $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
