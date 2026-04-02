package controllers

import org.scalatra._
import org.scalatra.json._
import org.json4s.{DefaultFormats, Formats}
import models.Category

class CategoryController extends ScalatraServlet with JacksonJsonSupport with CorsSupport{
  protected implicit lazy val jsonFormats: Formats = DefaultFormats
  var categories = List(Category(1, "Elektronika"), Category(2, "Biurowe"))

  options("/*") {
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }
  before() { contentType = formats("json") }

  get("/") { categories }
  get("/:id") { categories.find(_.id == params("id").toInt).getOrElse(halt(404)) }
  post("/") { val cat = parsedBody.extract[Category]; categories = categories :+ cat; cat }
  put("/:id") {
    val id = params("id").toInt
    val updated = parsedBody.extract[Category]
    categories = categories.map(c => if (c.id == id) updated.copy(id = id) else c)
    updated
  }
  delete("/:id") { categories = categories.filterNot(_.id == params("id").toInt); Ok() }
}