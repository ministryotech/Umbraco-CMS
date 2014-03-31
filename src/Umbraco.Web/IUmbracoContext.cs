using System;
using System.Web;
using umbraco.BusinessLogic;
using Umbraco.Core;
using Umbraco.Web.PublishedCache;
using Umbraco.Web.Routing;
using Umbraco.Web.Security;

namespace Umbraco.Web
{
    public interface IUmbracoContext : IDisposeOnRequestEnd
    {
        /// <summary>
        /// Gets the current ApplicationContext
        /// </summary>
        ApplicationContext Application { get; }

        /// <summary>
        /// Gets the WebSecurity class
        /// </summary>
        WebSecurity Security { get; }

        /// <summary>
        /// Gets the uri that is handled by ASP.NET after server-side rewriting took place.
        /// </summary>
        Uri OriginalRequestUrl { get; }

        /// <summary>
        /// Gets the cleaned up url that is handled by Umbraco.
        /// </summary>
        /// <remarks>That is, lowercase, no trailing slash after path, no .aspx...</remarks>
        Uri CleanedUmbracoUrl { get; }

        /// <summary>
        /// Gets or sets the published content cache.
        /// </summary>
        ContextualPublishedContentCache ContentCache { get; }

        /// <summary>
        /// Gets or sets the published media cache.
        /// </summary>
        ContextualPublishedMediaCache MediaCache { get; }

        /// <summary>
        /// Boolean value indicating whether the current request is a front-end umbraco request
        /// </summary>
        bool IsFrontEndUmbracoRequest { get; }

        /// <summary>
        /// A shortcut to the UmbracoContext's RoutingContext's NiceUrlProvider
        /// </summary>
        /// <remarks>
        /// If the RoutingContext is null, this will throw an exception.
        /// </remarks>
        UrlProvider UrlProvider { get; }

        /// <summary>
        /// Gets/sets the RoutingContext object
        /// </summary>
        RoutingContext RoutingContext { get; set; }

        /// <summary>
        /// Gets/sets the PublishedContentRequest object
        /// </summary>
        PublishedContentRequest PublishedContentRequest { get; set; }

        /// <summary>
        /// Exposes the HttpContext for the current request
        /// </summary>
        HttpContextBase HttpContext { get; }

        /// <summary>
        /// Gets a value indicating whether the request has debugging enabled
        /// </summary>
        /// <value><c>true</c> if this instance is debug; otherwise, <c>false</c>.</value>
        bool IsDebug { get; }

        /// <summary>
        /// Gets the current page ID, or <c>null</c> if no page ID is available (e.g. a custom page).
        /// </summary>
        int? PageId { // TODO - this is dirty old legacy tricks, we should clean it up at some point
            // also, what is a "custom page" and when should this be either null, or different
            // from PublishedContentRequest.PublishedContent.Id ??
            // SD: Have found out it can be different when rendering macro contents in the back office, but really youshould just be able
            // to pass a page id to the macro renderer instead but due to all the legacy bits that's real difficult.
            get; }

        /// <summary>
        /// Gets the current logged in Umbraco user (editor).
        /// </summary>
        /// <value>The Umbraco user object or null</value>
        [Obsolete("This should no longer be used since it returns the legacy user object, use The Security.CurrentUser instead to return the proper user object")]
        User UmbracoUser { get; }

        /// <summary>
        /// Determines whether the current user is in a preview mode and browsing the site (ie. not in the admin UI)
        /// </summary>
        /// <remarks>Can be internally set by the RTE macro rendering to render macros in the appropriate mode.</remarks>
        bool InPreviewMode { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is disposed.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance is disposed; otherwise, <c>false</c>.
        /// </value>
        bool IsDisposed { get; }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        /// <filterpriority>2</filterpriority>
        void Dispose();
    }
}