package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json

case class Star(name: String, x: Int, y: Int, defense: Int, pop: Int, commander: String, color: String)

case class Commander(name: String, color: String)

trait StarGenerator {

  val EMPIRE = "Empire"
  val ANONYMOUS = "Anonymous"

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
      random.nextInt(3) + 1,
      random.nextInt(3) + 1,
      EMPIRE,
      "black"
    )
  }

  def genStars = {
    val res = genStar.copy(commander = ANONYMOUS, color = "green") :: List.fill(499)(genStar)
    names = Set.empty
    coords = Set.empty
    res
  }

  def distance(s1: Star, s2: Star) = {
    val dx = s1.x - s2.x
    val dy = s1.y - s2.y
    dx * dx + dy * dy
  }

}
object Application extends Controller with StarGenerator {

  def index = Action {
    Ok(views.html.index("index page"))
  }

  def radar = Action {

    import play.api.libs.json._

    implicit val personFormat = Json.format[Star]
    val stars = genStars

    val owned = stars.filter(_.commander == ANONYMOUS)
    val neighborhood = stars.filter(n => n.commander != ANONYMOUS && owned.exists(o => distance(o, n) < 50))

    Ok(Json.toJson(neighborhood ::: owned))
  }

}
