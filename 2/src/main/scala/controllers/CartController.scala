package controllers

import org.scalatra._
import org.scalatra.json._
import org.json4s.{DefaultFormats, Formats}
import models.Cart

class CartController extends ScalatraServlet with JacksonJsonSupport with CorsSupport{
  protected implicit lazy val jsonFormats: Formats = DefaultFormats
  var cartItems = List(Cart(1, 1, 2)) // Koszyk np: id=1, productId=1, qty=2

  options("/*") {
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }
  before() { contentType = formats("json") }

  get("/") { cartItems }
  get("/:id") { cartItems.find(_.id == params("id").toInt).getOrElse(halt(404)) }
  post("/") { val item = parsedBody.extract[Cart]; cartItems = cartItems :+ item; item }
  put("/:id") {
    val id = params("id").toInt
    val updated = parsedBody.extract[Cart]
    cartItems = cartItems.map(c => if (c.id == id) updated.copy(id = id) else c)
    updated
  }
  delete("/:id") { cartItems = cartItems.filterNot(_.id == params("id").toInt); Ok() }
}