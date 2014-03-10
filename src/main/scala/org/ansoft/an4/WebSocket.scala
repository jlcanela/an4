package org.ansoft.an4

import unfiltered.netty.websockets._
import scala.collection.concurrent
import scala.collection.concurrent.TrieMap
import play.api.libs.json.JsValue

/** unfiltered plan */
object WebSocket extends Plan with CloseOnException {

  val sockets: concurrent.Map[Int, WebSocket] =  new TrieMap[Int, WebSocket]()//new java.util.concurrent.ConcurrentMap[Int, WebSocket] with concurrent.Map[Int, WebSocket] {}


  def notify(msg: JsValue) = sockets.values.foreach { s =>
    if(s.channel.isConnected)  s.send(msg.toString)
  }

  val pass = DefaultPassHandler

  def intent = {
    case _ => {
      case Open(s) =>
        //notify("%s|joined" format s.channel.getId)
        sockets += (s.channel.getId.intValue -> s)
       // s.send("sys|hola!")
      case Message(s, Text(msg)) =>
        //notify("%s|%s" format(s.channel.getId, msg))
      case Close(s) =>
        sockets -= s.channel.getId.intValue
       // notify("%s|left" format s.channel.getId)
      case Error(s, e) =>
        e.printStackTrace
    }

  } //*///.onPass(_.sendUpstream(_)))
}


