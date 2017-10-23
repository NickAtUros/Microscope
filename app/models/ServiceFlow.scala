package models;

import play.api.libs.json.Json
import java.sql.Timestamp

// Create a ServiceFlow object in order to insert into the database
case class ServiceFlow(
  id: Option[Long],
  fromSvc: String,
  toSvc: String,
  sentTime: Option[Timestamp]
)
