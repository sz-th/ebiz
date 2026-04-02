import org.scalatra._
import javax.servlet.ServletContext
import controllers._

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
    context.mount(new ProductController, "/products/*")
    context.mount(new CategoryController, "/categories/*")
    context.mount(new CartController, "/cart/*")
  }
}