package org.ansoft.an4.model

object StarDao {

  val gen = new StarGenerator {}

  private var starList : List[Star] = gen.genStars.zipWithIndex.map({ case (s, id) => s.copy(id = id) })

  def stars(commander: String) = {
    val owned = starList.filter(_.commander == commander)
    val neighborhood = starList.filter(n => n.commander != commander && owned.exists(o => o.distance(n) <= 50))

    owned ::: neighborhood
  }

  def findByName(name: String) = starList.find(_.name == name)

  def find(id: Int) = starList.filter(_.id == id).headOption

  def update(star: Star) = {
    def replace(updated: Star) = (old: Star) => if (updated.id == old.id) updated else old
    starList = starList.map(replace(star))
  }

  def delete(id: Int) = {
    starList = starList.filter(_.id != id)
  }

  def create(star: Star) = {
    starList = starList ::: List(star.copy(id = starList.size + 1))
  }

}
