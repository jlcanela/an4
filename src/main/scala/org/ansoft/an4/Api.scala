package org.ansoft.an4

import unfiltered.request._
import unfiltered.response._
import unfiltered.netty._
import unfiltered.{Cycle, Cookie}

import org.ansoft.an4.lib.Helper._
import org.ansoft.an4.model.{StarDao, Star}
import org.ansoft.an4.lib.JsonResult
import play.api.libs.json.{JsString, JsValue, Format, Json}
import play.api.libs.json.Json._
import com.fasterxml.jackson.core.JsonParser
import unfiltered.netty.cycle.Plan

object AsJson
{
  def unapply[T](req: HttpRequest[T]) = try {
    Some(Json.parse(Body.bytes(req)))
  } catch {
    case _: Exception => None
  }

}


case class User(val name:String)

object AuthUser {
  def unapply(cookies: Map[String, Option[Cookie]]) = cookies("auth") match {
    case Some(Cookie(_, user, _, _, _, _, _, _)) => Some(User(user))
    case _ => None
  }
}

object Req {
  def apply[Req, Res](f:PartialFunction[HttpRequest[Req], HttpRequest[Req] => ResponseFunction[Res]]):Cycle.Intent[Req, Res] = {
    case req if f.isDefinedAt(req) => f(req)(req)
  }
}

object UserAuth {
  def apply[Req, Res](f:User =>  ResponseFunction[Res]): HttpRequest[Req] => ResponseFunction[Res] = {
    case Cookies(AuthUser(user)) =>
      f(user)
    case _                  => Unauthorized
  }
}

/** unfiltered plan */
object Api extends cycle.Plan
with cycle.SynchronousExecution with ServerErrorResponse with ApiImpl{
  import QParams._

  def intent = /*auth2 orElse */auth orElse noAuth

  def auth2:Plan.Intent =  Req{
    case GET(Path(Seg("api":: "stars" :: Nil))) => UserAuth{ user =>
      JsonResult(StarDao.stars(user.name).toEmberList, true)
    }
  }

  def auth:Plan.Intent =  {
    case GET(Path(Seg("api":: "stars" :: Nil))) =>  JsonResult(StarDao.stars("Anonymous").toEmberList, true)

    case POST(req @ Path(Seg("api" :: "event" :: Nil))) & Cookies(cookies) & AsJson(ev) =>
      event(ev)
      JsonResult(Json.obj("submitted" -> "true"))
  }

  def noAuth:Plan.Intent =  {
    case POST(req @ Path(Seg("api" :: "auth" :: Nil))) & AsJson(js) =>
      auth(js) map { user =>
        SetCookies(Cookie("auth", user)) ~> JsonResult(Json.obj("auth" -> "true"))
      } getOrElse JsonResult(Json.obj("auth" -> "false"))

    case POST(req @ Path(Seg("api" :: "signup" :: Nil))) & AsJson(js) =>
      val result = (js \ "username", js \ "email", js \ "password" ) match {
        case (JsString(name), JsString(password), JsString(email)) => signup(name, password, email)
        case _ => None
      }

      result map { user =>
        JsonResult(Json.obj("signup" -> "true"))
      } getOrElse JsonResult(Json.obj("signup" -> "false"))

    case POST(req @ Path(Seg("token" :: Nil))) & Params(params) =>
      (params.apply("username").headOption, params.apply("password").headOption) match {
        case (username, password) => SetCookies(Cookie("auth", username.get)) ~> JsonResult(Json.obj(
          "access_token" -> "2YotnFZFEjr1zCsicMWpAA",
          "token_type" -> "bearer"
        ))
        case _ => JsonResult(Json.obj("auth" -> "false"))
      }

    case GET(req @ Path(Seg("config.js" :: Nil))) => {
      val host = req.headers("Host")
      val h1 = if (host.hasNext) {
        host.next
      } else "localhost"


      HtmlContent ~> ResponseString(s"var host = '$h1';")
    }

    case GET(Path(Seg("api" :: path))) => Html(<Api>api:{path.mkString("/")}</Api>)

  }


}
