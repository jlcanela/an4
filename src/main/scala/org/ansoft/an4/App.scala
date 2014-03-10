package org.ansoft.an4

import unfiltered.util._
import util.Properties
import grizzled.slf4j.Logging

object App extends Logging {

  def main(args: Array[String]) {

    val port = Properties.envOrElse("PORT", "9000").toInt
    info("started on port:%d".format(port))

    unfiltered.netty.Http(port, "0.0.0.0")
    .handler(WebSocket.onPass(_.sendUpstream(_)))
    .resources(getClass().getResource("/public/"), 0, passOnFail = true)
    .handler(Api)
    .run { s =>
      if (java.net.InetAddress.getLocalHost.getHostName == "Jean-Lucs-MacBook-Pro.local") {
        val path: String = App.getClass.getResource("/public/client.html").getFile
        Browser.open(s"http://localhost:$port/an4.html" )
      }
    }
  }


}
