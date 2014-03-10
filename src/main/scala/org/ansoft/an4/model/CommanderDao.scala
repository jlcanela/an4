package org.ansoft.an4.model


object DbImpl {
  type HaveIdAndName = {
    def id: Int
    def name: String
  }
}

trait DbImpl[T <: DbImpl.HaveIdAndName] {

  def createDefaultList: List[T]

  protected var list: List[T] = createDefaultList

  def findByName(name: String) = list.find(_.name == name)

  def exists(name: String) = list.exists(_.name == name)

  def find(id: Int) = list.filter(_.id == id).headOption

  def update(t: T) = {
    def replace(updated: T) = (old: T) => if (updated.id == old.id) updated else old
    list = list.map(replace(t))
  }

  def delete(id: Int) = {
    list = list.filter(_.id != id)
  }

  def nextId = list.size + 1

  def add(t: T) = {
    list = t :: list
  }


}

object CommanderDao extends DbImpl[Commander] {

  val gen = new StarGenerator {}

  def createDefaultList = List(Commander(0, "", "", "", ""))

  def existsEmail(email: String) = list.exists(_.email == email)

  def create(c: Commander) = if (!exists(c.name) && !existsEmail(c.email)) {
    add(c.copy(id = nextId))
    true
  } else {
    false
  }

}
