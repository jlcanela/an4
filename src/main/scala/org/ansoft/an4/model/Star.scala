package org.ansoft.an4.model


case class Star(id: Int, name: String, x: Int, y: Int, shuttles: Int, pop: Int, tech: Int, commander: String, color: String) {

  def distance(s: Star) = {
    val dx = x - s.x
    val dy = y - s.y
    dx * dx + dy * dy
  }

}
