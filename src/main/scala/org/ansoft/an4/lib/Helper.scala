package org.ansoft.an4.lib

import play.api.libs.json._
import scala.reflect.ClassTag
import unfiltered.response.{ResponseString, JsonContent, ComposeResponse}

case class JsonResult(value: JsValue, pretty: Boolean = false) extends
ComposeResponse(JsonContent ~> ResponseString(if (pretty) Json.prettyPrint(value) else value.toString()))

object Helper {

  implicit class ListAdapter[T](l: List[T])(implicit fmt: Format[List[T]], ct: ClassTag[T]) {

    def toEmberList = {
      Json.obj(
        ct.runtimeClass.getSimpleName().toLowerCase() -> l
      )
    }

  }

  implicit class ObjectAdapter[T](obj: T)(implicit fmt: Format[T], ct: ClassTag[T]) {

    def toEmberObject = Json.obj(
      "status" -> "ok",
      ct.runtimeClass.getSimpleName().toLowerCase() -> obj
    )

  }

  def readT[T](id: Int, fmt : Format[T])(implicit ct: Manifest[T]) = new Reads[T] {
    def reads(json: JsValue) =
      (json \ ct.runtimeClass.getSimpleName().toLowerCase()) match {
        case obj: JsObject => fmt.reads(obj +  ("id" -> JsNumber(id)))
        case x => println(x); throw new IllegalArgumentException(s"invalid ${x.toString()}")
      }

  }

  val EmberNotFound = Json.obj("status" -> "notfound")

  //implicit val fmt: Format[List[String]] = Json.format[List[String]]
}
