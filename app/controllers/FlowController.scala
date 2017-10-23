package controllers

import play.api.mvc._
import play.api.libs.ws._
import javax.inject._
import dao.ServiceFlowDAO
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.Future
import play.api.Logger

import models.ServiceFlow

import play.api.libs.json.Json
import play.api.libs.json._;

import java.sql.Timestamp;
import java.util.Date;

import scala.util.{Left, Right, Success, Failure}


@Singleton
class FlowController @Inject() (flowDAO: ServiceFlowDAO) extends Controller {

  // Endpoint to return number of datapoints
  def count() = Action.async {
    flowDAO.count().map { count =>
      Ok(Json.toJson(count))
    }
  }

  //Endpoint to retrieve flow data in JSON format between two timestamps
  def fetchBetween() = Action.async(parse.json) { implicit request =>
    val start: String = (request.body \ "start").as[String]
    val end: String = (request.body \ "end").as[String]

    flowDAO.fetchBetween(start, end).map { flows =>
      val objects = flows.map { case (from, to, count) =>
        Json.obj (
          "from" -> from,
          "to" -> to,
          "count" -> count
        )
      }

      Ok(JsArray(objects))
    }
  }

  // Endpoint to retrieve all distinct services in the database in JSON Sequence
  def distinctServices() = Action.async {
    flowDAO.getDistinctServices().map { svcs =>
      Ok(Json.toJson(svcs))
    }
  }

  // Endpoint to insert a new flow into the database, giving it the current time
  def insert() = Action.async(parse.json) { implicit request =>
    val from: String = (request.body \ "fromSvc").as[String]
    val to: String = (request.body \ "toSvc").as[String]

    val date: Date = new Date()
    val flow = ServiceFlow(None, from, to, Some(new Timestamp(date.getTime())))
    Logger.info(s"New Flow: $from -> $to")
    flowDAO.insert(flow).map {
      case true => Ok
      case false => BadRequest
    }
  }

}
