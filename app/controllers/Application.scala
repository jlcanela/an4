package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json

case class Star(name: String, x: Int, y: Int, defense: Int, pop: Int)

case class Commander(name: String, color: String)

trait StarGenerator {

  val random = new scala.util.Random()

  val voyels = "aeiouy"
  val consons = "bcdfghjklmnpqrstvwz"

  def voyel = voyels(random.nextInt(voyels.size))
  def conson = consons(random.nextInt(consons.size))

  def syllab = "" + voyel + conson

  var names = Set[String]()
  var coords = Set[(Int, Int)]()

  def genName : String = {
    val newName = List.fill(3)(syllab).mkString
    if (names.contains(newName)) genName
    else {
      names = names + newName
      newName
    }
  }

  def genCoord : (Int, Int) = {
    val newCoord = (random.nextInt(100) - 50, random.nextInt(100) - 50)
    if (coords.contains(newCoord)) genCoord
    else {
      coords = coords + newCoord
      newCoord
    }
  }

  def genStar = {
    val (x, y) = genCoord
    Star(
      genName,
      x,
      y,
      random.nextInt(3),
      random.nextInt(3)
    )
  }

}
object Application extends Controller with StarGenerator {

  def index = Action {
    Ok(views.html.index("index page"))
  }

  def radar = Action {

    import play.api.libs.json._

    val stars = List.fill(500)(genStar)
    implicit val personFormat = Json.format[Star]

 /*   val json = """[{ "name": "center", "x": 0, "y": 0, "defense": 5, "pop": 1, "size": 1, "color": "red"},
{ "name": "top", "x":  0, "y":  -20, "defense": 1, "pop": 2, "size": 2, "color": "yellow"},
{ "name": "bottom", "x":  0, "y":  20, "defense": 2, "pop": 4, "size": 3, "color": "blue"},
{ "name": "left", "x":  -20, "y":  0, "defense": 3, "pop": 8, "size": 4, "color": "black"},
{ "name": "right", "x":  20, "y":  0, "defense": 4, "pop": 200, "size": 10, "color": "pink"},
{ "name": "canopi", "x":  2, "y":  0, "defense": 4, "pop": 3, "size": 10, "color": "green"},
{ "name": "extrem", "x":  50, "y":  0, "defense": 4, "pop": 3, "size": 10, "color": "maroon"}]"""
      */

    Ok(Json.toJson(stars))
    //Ok(Json.parse(json))
  }

}
