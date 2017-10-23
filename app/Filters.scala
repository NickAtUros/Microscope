import javax.inject.Inject

import play.api.http.HttpFilters
import play.filters.cors.CORSFilter

// Enable the CORS Filter in our application, configured `application.conf`
class Filters @Inject() (corsFilter: CORSFilter) extends HttpFilters {
  def filters = Seq(corsFilter)
}
