organization := "com.example"

name := "An4b"

version := "0.1.0"

libraryDependencies ++= Seq(
  "net.databinder" %% "unfiltered-netty" % "0.7.1",
  "net.databinder" %% "unfiltered-netty-websockets" % "0.7.1",
  "com.typesafe.play" %% "play-json" % "2.2.1",
  "org.scalaz" %% "scalaz-core" % "7.0.3",
  "org.typelevel" %% "scalaz-contrib-210" % "0.1.4",
  "org.typelevel" %% "scalaz-contrib-validation" % "0.1.4",
  "org.slf4j" % "jcl-over-slf4j" % "1.6.2" withSources(),
  "org.clapper" %% "grizzled-slf4j" % "1.0.1"
)

packageArchetype.java_application