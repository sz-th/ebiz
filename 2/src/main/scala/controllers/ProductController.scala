package controllers

import org.scalatra._
import org.scalatra.json._
import org.json4s.{DefaultFormats, Formats}
import models.Product

class ProductController extends ScalatraServlet with JacksonJsonSupport with CorsSupport {
  protected implicit lazy val jsonFormats: Formats = DefaultFormats

  var products = List(
    Product(1, "Laptop", 3500.0),
    Product(2, "Myszka", 150.0)
  )
  options("/*") {
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }

  before() {
    contentType = formats("json")
  }

  get("/") {
    products
  }

  get("/:id") {
    val id = params("id").toInt
    products.find(_.id == id) match {
      case Some(product) => product
      case None => halt(404, "Product not found")
    }
  }

  post("/") {
    val newProduct = parsedBody.extract[Product]
    products = products :+ newProduct
    newProduct
  }

  put("/:id") {
    val id = params("id").toInt
    val updatedProduct = parsedBody.extract[Product]
    products = products.map {
      case p if p.id == id => updatedProduct.copy(id = id)
      case p => p
    }
    updatedProduct
  }

  delete("/:id") {
    val id = params("id").toInt
    products = products.filterNot(_.id == id)
    Ok(s"Deleted product $id")
  }
}