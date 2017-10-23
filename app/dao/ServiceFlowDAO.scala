package dao

import javax.inject.{Singleton, Inject}
import scala.concurrent.Future
import models.ServiceFlow
import play.api.db.slick.HasDatabaseConfig
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import slick.driver.JdbcProfile

import scala.util.{Left, Right, Success, Failure}

import java.sql.Timestamp

import org.postgresql.util.PSQLException

// ServiceFlow Trait so that we can import the service flows table into any Singleton class
trait ServiceFlowComponent { self: HasDatabaseConfig[JdbcProfile] =>
  import driver.api._

  class ServiceFlows(tag: Tag) extends Table[ServiceFlow](tag, "svc_flow") {
    def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
    def fromSvc = column[String]("from_svc")
    def toSvc = column[String]("to_svc")
    def sentTime = column[Option[Timestamp]]("sent_time")
    def * = (id, fromSvc, toSvc, sentTime) <> ((ServiceFlow.apply _).tupled, ServiceFlow.unapply _)
  }
}

// Data access object to expose query functionality on ServiceFlow table
@Singleton()
class ServiceFlowDAO extends GenericDAO with ServiceFlowComponent {
  import driver.api._

  val flows = TableQuery[ServiceFlows]

  // Get the count of flows as a future
  def count(): Future[Int] = {
    val action = flows.length
    db.run(action.result).map { result => result }
  }

  // Get the data between two timestamps as a future sequence
  def fetchBetween(start: String, end: String): Future[Seq[(String, String, Long)]] = {
    val action = sql"""SELECT from_svc, to_svc, COUNT(*)
                       FROM svc_flow
                       WHERE sent_time BETWEEN $start::timestamp
                       AND $end::timestamp
                       GROUP BY from_svc, to_svc;
                    """.as[(String, String, Long)]

    // Run the action as a try, and on failure return an empty sequence
    db.run(action.asTry).map {
      case Success(data: Seq[(String, String, Long)]) => data
      case Failure(err) => Seq.empty[(String, String, Long)]
    }
  }

  // Get the distinct services that are in the database
  def getDistinctServices(): Future[Seq[String]] = {
    val action = sql"""SELECT DISTINCT(from_svc) FROM svc_flow
                       UNION
                       SELECT DISTINCT(to_svc) FROM svc_flow;
                    """.as[String]

    db.run(action.asTry).map {
      case Success(data: Seq[String]) => data
      case Failure(data) => Seq.empty[String]
    }
  }

  // Insert a new flow into the database
  def insert(flow: ServiceFlow): Future[Boolean] = {
    val action = flows += flow
    db.run(action.asTry).map{
      case Success(_) => true
      case Failure(_) => false
    }
  }

}
