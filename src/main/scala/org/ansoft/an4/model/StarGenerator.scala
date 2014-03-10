package org.ansoft.an4.model

trait StarGeneratorTrait {
  val gen = new StarGenerator {}
}

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
    val newCoord = (random.nextInt(50), random.nextInt(50))
    if (coords.contains(newCoord)) genCoord
    else {
      coords = coords + newCoord
      newCoord
    }
  }

  def genStar = {
    val (x, y) = genCoord
    val tech = random.nextInt(3) + 1
    Star(
      0,
      genName,
      x,
      y,
      random.nextInt(3) + 1,
      tech,
      tech,
      EMPIRE,
      "black"
    )
  }

  def genStars = {
    val res = genStar.copy(commander = ANONYMOUS, color = "green") :: genStar.copy(commander = ANONYMOUS, color = "green") :: List.fill(498)(genStar)
    names = Set.empty
    coords = Set.empty
    res
  }

}
