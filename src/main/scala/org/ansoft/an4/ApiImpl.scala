package org.ansoft.an4

import org.ansoft.an4.model.{Commander, CommanderDao, StarDao, Star}
import play.api.libs.json.{JsString, JsValue, Json}
import scalaz.Validation


trait ApiImpl {

  implicit val s = Json.format[Star]

  val DEVELOP_SHUTTLE_CONSUMED = 3

  def develop(star: Star) : Validation[String, Star] = {
    if (star.pop >= star.tech) {
      scalaz.Failure("cannot develop more than current tech level")
    } else if (star.shuttles < DEVELOP_SHUTTLE_CONSUMED) {
      scalaz.Failure("develop requires at least 3 shuttles")
    } else {
      val newPop = star.pop + 1
      val newShuttles = star.shuttles - 3
      scalaz.Success(star.copy(pop = newPop, shuttles = newShuttles))
    }
  }

  def loot(star: Star) : Validation[String, Star] = {
    if (star.tech < 1) {
      scalaz.Failure("loot requires at least tech_level = 1")
    } else {
      val newTech = star.tech - 1
      val newShuttles = star.shuttles + 3
      val newPop = if (star.pop > newTech) newTech else star.pop
      scalaz.Success(star.copy(tech = newTech, shuttles = newShuttles, pop = newPop))
    }
  }

  def produce(star: Star) : Validation[String, Star] = {
    if (star.tech <= 0) {
      scalaz.Failure("produce requires at least tech_level = 1")
    } else {
      val newShuttles = star.shuttles + star.pop
      scalaz.Success(star.copy(shuttles = newShuttles))
    }
  }

  def notifyMessage(message: String) = WebSocket.notify(Json.obj("event" -> "notify-message", "msg" -> JsString(message)))
  def updateStar(star: Star) = WebSocket.notify(Json.obj("event" -> "update-star", "star" -> Json.toJson(star)))

  def execCommand(starName: String, f: Star => Validation[String, Star]) {
    StarDao.findByName(starName) map { star =>
      val updatedStar = f(star) fold(
        message => {
          notifyMessage(message)
        },
        star => {
          StarDao.update(star)
          updateStar(star)
        }
      )
    }
  }

  def event(ev: JsValue) = {
    ev \ "event" match {
      case JsString("develop") if ev \ "star" != null => ev \ "star" match {
        case JsString(star) => execCommand(star, develop)
        case x => println(s"invalid event value $x")
      }
      case JsString("loot") if ev \ "star" != null => ev \ "star" match {
        case JsString(star) => execCommand(star, loot)
        case x => println(s"invalid event value $x")
      }
      case JsString("produce") if ev \ "star" != null => ev \ "star" match {
        case JsString(star) => execCommand(star, produce)
        case x => println(s"invalid event value $x")
      }
      case x =>
        println(s"unsupported event value $x")
    }
  }

  def auth(js: JsValue) = {
    js \ "user" match {
      case JsString(name) => Some(name)
      case _ => None
    }
  }

  def signup(username: String, password: String, email: String) = {
    if (CommanderDao.create(Commander(0, username, password, email, "green"))) None else Some("unable to create")
  }
}
