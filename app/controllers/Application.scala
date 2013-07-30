package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("index page"))
  }

  def radar = Action {

    val json = """[{ "name": "center", "x": 0, "y": 0, "defense": 5, "pop": 1, "size": 1, "color": "red"},
{ "name": "top", "x":  0, "y":  -20, "defense": 1, "pop": 2, "size": 2, "color": "yellow"},
{ "name": "bottom", "x":  0, "y":  20, "defense": 2, "pop": 4, "size": 3, "color": "blue"},
{ "name": "left", "x":  -20, "y":  0, "defense": 3, "pop": 8, "size": 4, "color": "black"},
{ "name": "right", "x":  20, "y":  0, "defense": 4, "pop": 200, "size": 10, "color": "pink"},
{ "name": "canopi", "x":  2, "y":  0, "defense": 4, "pop": 3, "size": 10, "color": "green"},
{ "name": "extrem", "x":  50, "y":  0, "defense": 4, "pop": 3, "size": 10, "color": "maroon"}]"""

    Ok(Json.parse(json))
  }

}
