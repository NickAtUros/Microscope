# Microscope :: Platform Flow Visualization

Microscope strives to be an easy to utilize, high performance platform to visualize your platform's data flow! Unlike competitors
which offer complicated solutions for data aggregation, storage and visualization, Microscope's goal is to be easy to setup,
and straightforward to utilize.

For developers, Microscope exposes a RESTful API to send flow data, which means that your web services simply make fire-and-forget calls to Microscope that they are engaging in receiving our passing along some form of data.

Then, the Microscope web application allows end users to query for flows based on time, for your entire platform or for a specific endpoint.

Utilize Microscope to:

* See how your services are behaving in response to an input
* Analyze over utilization / underutilization of services
* (IN PROGRESS) See response times from your service, and analyze bottlenecks.

In contradiction to utilizing a 3rd party service, you have full control over Microscope and it's 100% free, 100% open source for everyone to use.

![https://github.com/PranavSathy/microscope](http://i.imgur.com/T3Furbr.png)

## Development

### Requirements:

* JVM v1.8 +
* Scala 2.11.7+
* SBT 0.13.9+
* PostgreSQL 9.4+
  * DB: micro_db
  * Username: microscope
  * Password: microscope
* Node.js v4+
* NPM v2+
* NPM Global Dependencies
  * Bower
  * Gulp

### Instructions

Clone the repository, and navigate to the root directory in a terminal. Run the following commands:

```
$ sbt flywayMigrate
$ sbt run
```

In another terminal, navigate to the `client` subdirectory, and run the following commands:

```
$ npm install
$ gulp
$ gulp serve
```

You can now navigate to [localhost:8080](http://localhost:8080/ "Microscope Dashboard") to see the Microscope web application, which communicates with the server running at port 9000.

### Configuration

* `conf/application.conf` - Database configuration parameters and CORS configuration
* `conf/logback.xml` - Logging configuration
* `build.sbt` - flyWay migration connection parameters (should be same as `application.conf`)

### Code

All the client side code is available within the `client` subdirectory. Currently it is written in angular.js utilizing only ES5 syntax.

The backend code can be found inside the `app` subdirectory, written entirely in Scala.
