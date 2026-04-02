import org.scalatra._
import javax.servlet.ServletContext
import controllers._

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
    context.setInitParameter("org.scalatra.cors.allowedOrigins", "http://localhost:3000,http://example.com")
    context.setInitParameter("org.scalatra.cors.allowedMethods", "GET,POST,PUT,DELETE,OPTIONS")
    
    context.mount(new ProductController, "/products/*")
    context.mount(new CategoryController, "/categories/*")
    context.mount(new CartController, "/cart/*")
  }
}