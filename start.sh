#!/bin/bash

sudo ./target/universal/microservice-1.0/bin/microservice -Dconfig.resource=prod/application.conf -Dlogger.resource=prod/logback.xml &
