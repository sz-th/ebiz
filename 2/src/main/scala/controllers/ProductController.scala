package controllers

import org.scalatra._
import org.scalatra.json._
import org.json4s.{DefaultFormats, Formats}

class ProductController extends ScalatraServlet with JacksonJsonSupport {
  protected implicit lazy val jsonFormats: Formats = DefaultFormats

  before() {
    contentType = formats("json")
  }

  get("/") {
    "Kontroler Produktow dziala!"
  }
}