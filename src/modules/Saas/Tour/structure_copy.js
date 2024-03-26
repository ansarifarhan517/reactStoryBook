export const structure = {
  type: "STRUCTURE",
  stage: "PRODUCTTOUR",
  modelType: "LM", // 'FMLM' / 'ALLMILE' / 'FM'
  clientId: 0,
  userId: 0,
  percentage: 0,
  steps: [
    {
      stepId: "1",
      prevStepId: "0",
      nextStepId: "2",
      stepType: "STATIC",
      stepName: "USER_ACCESS_MANAGEMENT",
      headerLabelKey: "HEADER_LOGINEXT_CAPABILITIES",
      headerLabel: "Manage users and their accesses",
      isCompleted: false, //set true from post api
      status: "VISITED",
      selected: true,
      weightage: 10,
      templates: [
        {
          type: "Video",
          description:
            "You can easily bring your team members on board and define their specific roles and accesses to the various features and capabilities. Define a group of accesses within an Access Profile, attach it to an Organization Role, and link the Organization Role to relevant user(s). While there is a set of pre-configured Organization Roles and Access Profiles to get you up and running easily, you can always create your own.",
          descriptionKey: "USER_ACCESS_MANAGEMENT_DESCRIPTION",
          title: "",
          icon: "",
          videoUrl:
            "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
          ],
        },
      ],
      subSteps: [],
    },
    {
      stepId: "2",
      prevStepId: "1",
      nextStepId: "3",
      stepType: "STATIC",
      stepName: "BRANCH_CONFIRUGATION",
      headerLabelKey: "HEADER_BRANCH_CONFIRUGATION",
      headerLabel: "Set up hubs for your operations",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      subSteps: [],
      templates: [
        {
          type: "Video",
          description: `<div>
              <p>Hubs refer to operational centers where orders are processed by your team. They are used as base locations for orders and resources in the LogiNext system. Eventually, it is a hub that fulfills orders using the resources—users, vehicles, delivery associates, etc.—mapped to it. While the parent hubs can view the details of all of the child hubs, the child hubs cannot view the details of their parent hubs. This hierarchy is also respected in dashboards, reports, and analytics.</p>
              <p>At the time of account setup, the main hub was configured for your organization. As a dispatcher, you can add more hubs of your organization, shippers, and carriers in 3 ways:</p>
              <ul>
                <li>Filling out the Add Hub form</li>
                <li>Uploading an Excel file containing hubs’ details</li>
                <li>Using the Create Hub API</li>
              </ul>
            </div>`,
          descriptionKey: "BRANCH_CONFIRUGATION_DESCRIPTION",
          title: "",
          icon: "",
          videoUrl:
            "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
      ],
    },
    {
      stepId: "3",
      prevStepId: "2",
      nextStepId: "4",
      stepType: "STATIC",
      stepName: "DA_CONFIRUGATION",
      headerLabelKey: "HEADER_DA_CONFIRUGATION",
      headerLabel: "Onboard your delivery associates",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [],
      subSteps: [
        {
          stepId: "3.1",
          prevStepId: "2",
          nextStepId: "3.2",
          stepType: "STATIC",
          stepName: "DA_CREATION",
          headerLabelKey: "HEADER_DA_CREATION",
          headerLabel: "Create delivery associates",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>A delivery associate is somebody that picks up or delivers your customers’ orders. Each delivery associate is mapped to a hub and transports the orders belonging to that hub. You can add delivery associates in 3 ways:</p>
                  <ul>
                  <li>Filling out the Add Hub form</li>
                  <li>Uploading an Excel file containing hubs’ details</li>
                  <li>Using the Create Hub API</li>
                </div>`,
              descriptionKey: "DA_CREATION_DESCRIPTION",
              title: "",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
        {
          stepId: "3.2",
          prevStepId: "3.1",
          nextStepId: "4",
          stepType: "STATIC",
          stepName: "ACTIVATION_SKILLSET",
          headerLabelKey: "HEADER_ACTIVATION_SKILLSET",
          headerLabel: "Manage delivery associates",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Image",
              description: `<div>
                  <p>The LogiNext Driver App lets your delivery associates perform their day-to-day logistics tasks seamlessly. You can enable a setting to send an automated SMS invite to your delivery associates to download the Driver App soon as they are created in the system. </p>
                </div>`,
              descriptionKey: "ACTIVATION_APP_DESCRIPTION",
              titleKey: "ACTIVATION_APP_TITLE",
              title: "Send Driver App invites",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
            {
              type: "Image",
              description: `<div>
                  <p>Transporting some orders may require special handling, ambient temperatures, or specific skills on the part of delivery associates. The property Skill Sets lets you define such specifics to make transportation seamless. These Skill Sets can then be applied to the required orders and the relevant delivery associates’ configurations.</p>
                </div>`,
              descriptionKey: "ACTIVATION_SKILLSET_DESCRIPTION",
              title: "Specify skill sets",
              titleKey: "ACTIVATION_SKILLSET_TITLE",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      stepId: "4",
      prevStepId: "3",
      nextStepId: "5",
      stepType: "STATIC",
      stepName: "ORDER_MANAGEMENT",
      headerLabelKey: "HEADER_ORDER_MANAGEMENT",
      headerLabel: "Create and manage orders",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [],
      subSteps: [
        {
          stepId: "4.1",
          prevStepId: "3",
          nextStepId: "4.2",
          stepType: "STATIC",
          stepName: "CREATE_ORDERS",
          headerLabelKey: "HEADER_CREATE_ORDERS",
          headerLabel: "Create orders",
          isCompleted: false, //set true from post api
          status: "VISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>Order refers to any item(s) that a customer requests to be delivered to or picked up from their location. There can be multiple types of orders:</p>
                  <ul>
                    <li> First Mile: An order that is picked up from the pickup location and delivered to the first (or only) hub in its journey.</li>
                    <li> Last Mile: An order that is picked up from the final (or only) hub in its journey and delivered to the delivery location.</li>
                    <li>All Mile: An order that is picked up from the pickup location, brought in at one or more hubs along the way, and finally delivered to the delivery location.</li>
                    <li>Point-to-Point (P2P): An order that is picked up from the pickup location and delivered to the delivery location, without stops at any intermediate hubs.</li>
                  </ul>
                  <p>You can add orders in 3 ways:</p>
                  <ul>
                    <li>Filling out the Add Hub form</li>
                    <li>Uploading an Excel file containing orders’ details</li>
                    <li>Using the Create E2E Order APIs</li>
                  </ul>
                </div>`,
              descriptionKey: "DA_CREATION_DESCRIPTION",
              title: "",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: " https://products.loginextsolutions.com/product/#/order/addorder",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "https://support.loginextsolutions.com/index.php/2017/10/07/add-order-through-add-order-form-2/",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "https://products.loginextsolutions.com/product/#/developersPortal",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
        {
          stepId: "4.2",
          prevStepId: "4.1",
          nextStepId: "5",
          stepType: "STATIC",
          stepName: "MANAGE_ORDERS",
          headerLabelKey: "HEADER_MANAGE_ORDERS",
          headerLabel: "Manage Orders",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Image",
              description: `<div>
                  <p>The Order Lifecycle Management module lets you define your own order processing workflows. You can control various aspects of an order’s lifecycle such as the scanning process, the number of reattempts allowed, and more. The Pickup Flow and Delivery Flow are represented as simple flowcharts that let you visualize all the stages of an order’s lifecycle easily and configure various settings governing them.</p>
                </div>`,
              descriptionKey: "ORDER_LIFECYCLE_DESCRIPTION",
              titleKey: "ORDER_LIFECYCLE_TITLE",
              title: "Manage the order lifecycle",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
            {
              type: "Image",
              description: `<div>
                  <p>You can define how your orders would be packaged. The orders can be packaged as: 
                  a) Crates only: An order comprises of one or more crates. No record-keeping of items is required.
                  b) Crates and items: An order comprises of one or more crates. Each crate holds one or more items.</p>
                </div>`,
              descriptionKey: "CONFIGURE_ORDER_DESCRIPTION",
              title: "Configure order packaging",
              titleKey: "CONFIGURE_ORDER_TITLE",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
            {
              type: "Image",
              description: `<div>
                  <p>Air Waybill (AWB) labels are labels that can be affixed to orders to identify them easily. They contain crucial details such as the order number, AWB number, barcode, origin, destination, etc. You can create custom AWB labels with your logo, colors, and required details. You can even print different types of AWB labels for different orders, as needed.</p>
                </div>`,
              descriptionKey: "PRINT_AWD_DESCRIPTION",
              title: "Print custom AWB labels",
              titleKey: "PRINT_AWD_TITLE",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      stepId: "5",
      prevStepId: "4",
      nextStepId: "8",
      stepType: "STATIC",
      stepName: "Routes",
      headerLabelKey: "HEADER_ORDER_MANAGEMENT",
      subSteps: [],
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [
        {
          type: "Video",
          description: `<div>
              <p>An order’s path from the origin hub to the destination hub through a set of intermediate hubs is referred to as a route. While creating an All Mile order, you can specify its route.</p>
             
              <p>You can add routes in 2 ways:</p>
              <ul>
                <li>Filling out the Add Route form</li>
                <li>Uploading an Excel file containing routes’ details</li>
              </ul>
            </div>`,
          descriptionKey: "DA_ROUTES_DESCRIPTION",
          title: "",
          icon: "",
          videoUrl:
            "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
          buttons: [
            {
              label: "Try Now",
              url: "https://products.loginextsolutions.com/product/#/routes",
              labelKey: "TRY_NOW",
            },
          ],
        },
      ],
      headerLabel: "Routes",
    },
    {
      stepId: "6",
      prevStepId: "5",
      nextStepId: "7",
      stepType: "STATIC",
      stepName: "AUTO_ASSIGNEMENT",
      headerLabelKey: "HEADER_AUTO_ASSIGNEMENT",
      headerLabel: "Automate order assignments",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [],
      subSteps: [
        {
          stepId: "6.1",
          prevStepId: "5",
          nextStepId: "6.2",
          stepType: "STATIC",
          stepName: "AUTO_ASSIGNMENT_PROPERTIES",
          headerLabelKey: "HEADER_AUTO_ASSIGNMENT_PROPERTIES",
          headerLabel: "Set auto-assignment properties",
          isCompleted: false, //set true from post api
          status: "VISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>Auto-assignment refers to the process of automatically assigning your orders to the relevant delivery associates. The Auto-assignment engine assigns orders while following a set of properties that constitute an Auto-assignment Profile. You can specify various parameters and select a number of properties to tailor auto-assignment for your operational requirements. There is already a pre-configured Auto-assignment Profile that you can use for your operations. You can create more as needed.</p>
                </div>`,
              descriptionKey: "AUTO_ASSIGNMENT_PROPERTIES_DESCRIPTION",
              title: "",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
          ],
        },
        {
          stepId: "6.2",
          prevStepId: "6.1",
          nextStepId: "7",
          stepType: "STATIC",
          stepName: "AUTO_ASSIGN_ORDERS",
          headerLabelKey: "HEADER_AUTO_ASSIGN_ORDERS",
          headerLabel: "Auto-assign your orders",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>You can configure your orders to be auto-assigned soon as they are created in the system. Alternatively, you can use the Live screen to quickly auto-assign your orders in bulk. 
                  </p>
                  <p>
                  The Live screen is your vantage point for monitoring your day-to-day operations, identifying bottlenecks (if any), and taking quick actions on orders, trips, delivery associates, and carriers. </p>
                </div>`,
              descriptionKey: "AUTO_ASSIGN_ORDERS_DESCRIPTION",
              titleKey: "AUTO_ASSIGN_ORDERS_TITLE",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      stepId: "8",
      prevStepId: "7",
      nextStepId: "9",
      stepType: "STATIC",
      stepName: "Trips",
      headerLabelKey: "HEADER_ORDER_MANAGEMENT",
      headerLabel: "Plan trips for delivery associates",
      subSteps: [],
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [
        {
          type: "Video",
          description:
            `<div><p>Trip refers to a delivery associate’s order fulfillment journey. Each trip is associated with a delivery associate. In one trip, there may be multiple orders for the delivery associate to fulfill depending on your configurations. The Trip Planning engine plans the most optimized trips for your delivery associates, based on a set of properties that constitute a Planning Profile. You can create as many Planning Profiles as needed.</p>
            <p>To create an optimized trip plan, all you need to do is select the orders and the fleet that should be considered for fulfilling those orders. The Trip Planning engine takes care of the rest.</p></div>`,
          descriptionKey: "USER_ACCESS_MANAGEMENT_DESCRIPTION",
          title: "",
          icon: "",
          videoUrl:
            "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAIL",
            },
          ],
        },
      ],
    },
    {
      stepId: "9",
      prevStepId: "8",
      nextStepId: "10",
      stepType: "STATIC",
      stepName: "CUSTOMER_EXPERIENCE",
      headerLabelKey: "HEADER_CUSTOMER_EXPERIENCE",
      headerLabel: "Give your customers the best experience",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [],
      subSteps: [
        {
          stepId: "9.1",
          prevStepId: "8",
          nextStepId: "9.2",
          stepType: "STATIC",
          stepName: "TRACKING_LINK",
          headerLabelKey: "HEADER_TRACKING_LINK",
          headerLabel: "Brand your order tracking links",
          isCompleted: false, //set true from post api
          status: "VISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>Designed with a mobile-first approach, the LogiNext platform’s order tracking links are much more than a means to let your customers track their orders in real-time and communicate with the delivery associates. You can also empower your customers to update their addresses, manage notifications, and provide feedbacks, all from the same screen. Furthermore, you can use Branding Profiles to brand the tracking screen with your logo, colors, and web links; configure product promotions; and more. </p>
                </div>`,
              descriptionKey: "AUTO_ASSIGNMENT_PROPERTIES_DESCRIPTION",
              title: "",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
        {
          stepId: "9.2",
          prevStepId: "9.1",
          nextStepId: "10",
          stepType: "STATIC",
          stepName: "CUSTOMER_ALERTS",
          headerLabelKey: "HEADER_CUSTOMER_ALERTS",
          headerLabel: "Configure Custom Alerts",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>You can configure alerts to notify your dispatchers, customers, and shippers about various order updates (such as when an order gets created or picked up) in real-time. Alert Profiles let you define custom preferences for each alert, including which event should trigger the alert, who should receive it, whether it should be sent by email/SMS/IVR, the message body, and more. 
                  </p>
                  <p>
                  You can use Shipper Alert Profiles to configure alerts for the orders associated with your shippers and Hub Alert Profiles to configure alerts for the orders associated with your hubs. If an order doesn’t have any Hub/Shipper Alert Profile associated with it, the alert settings configured in the Organization Alert Profile apply. </p>
                </div>`,
              descriptionKey: "CUSTOMER_ALERTS_DESCRIPTION",
              titleKey: "CUSTOMER_ALERTS_TITLE",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      stepId: "10",
      prevStepId: "9",
      nextStepId: "11",
      stepType: "STATIC",
      stepName: "REPORTS",
      headerLabelKey: "HEADER_REPORTS",
      headerLabel: "View reports and analytics",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [
        {
          type: "Video",
          description:
            "You can view detailed and actionable reports and analytics on the various aspects of your logistics activities, including delivery associate compliance, auto-assignment analytics, and more. You can also configure schedulers to get specific reports automatically delivered to your inbox.",
          descriptionKey: "REPORTS_DESCRIPTION",
          title: "",
          icon: "",
          videoUrl:
            "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
      ],
      subSteps: [],
    },
    {
      stepId: "11",
      prevStepId: "10",
      nextStepId: "12",
      stepType: "STATIC",
      stepName: "INTEGRATE_APPLICATION",
      headerLabelKey: "HEADER_INTEGRATE_APPLICATION",
      headerLabel: "Integrate with other applications",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [],
      subSteps: [
        {
          stepId: "11.1",
          prevStepId: "10",
          nextStepId: "11.2",
          stepType: "STATIC",
          stepName: "THIRD_PARTY",
          headerLabelKey: "HEADER_THIRD_PARTY",
          headerLabel: "Set up third-party integrations",
          isCompleted: false, //set true from post api
          status: "VISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Video",
              description: `<div>
                  <p>Webhooks are alerts sent from one application to another to notify about event like ‘order delivered’ in real-time. Webhook Profiles let you configure and manage webhooks so that your organization, hubs, carriers, and shippers can be updated about various events in real-time.. While Organization Webhook Profiles subscribe to event that occur across all your hubs in, Hub Webhook Profiles subscribe to event updates for a particular hub of your organization/carrier. Similarly, you can create Shipper Webhook Profiles for your shippers to get notifications.</p>
                </div>`,
              descriptionKey: "THIRD_PARTY_DESCRIPTION",
              title: "",
              icon: "",
              videoUrl:
                "https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
        {
          stepId: "11.2",
          prevStepId: "11.1",
          nextStepId: "12",
          stepType: "STATIC",
          stepName: "THIRD_PARTY_SYSTEM",
          headerLabelKey: "HEADER_THIRD_PARTY_SYSTEM",
          headerLabel: "Integrate With Third-party Systems Seamlessly",
          isCompleted: false, //set true from post api
          status: "UNVISITED",
          selected: false,
          weightage: 10,
          templates: [
            {
              type: "Image",
              description: `<div>
                  <p>The LogiNext platform uses API tokens to provide authorized access to its APIs. To interact with a LogiNext API, you need to add your API token as part of the call. You can generate API tokens right from the Dispatcher Web App or by calling a specific API endpoint.</p>
                </div>`,
              descriptionKey: "GENERATE_API_DESCRIPTION",
              titleKey: "GENERATE_API_TITLE",
              title: "Generate API token",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
            {
              type: "Image",
              description: `<div>
                  <p>The Integration Marketplace module lets you integrate with over 100 applications to bring end-to-end visibility across all your systems. In just a few clicks, you can seamlessly integrate with numerous SMS gateways, payment gateways, single sign-on platforms, and more. Within Integration Marketplace, you will also find a dedicated sub-module named Carrier Integration Marketplace, which offers integration with numerous carrier partners, such as GrabExpress and Pandago.</p>
                </div>`,
              descriptionKey: "INTEGRATE_DESCRIPTION",
              title: "Integrate seamlessly",
              titleKey: "INTEGRATE_TITLE",
              icon: "",
              videoUrl: "",
              buttons: [
                {
                  label: "Try Now",
                  url: "/try",
                  labelKey: "TRY_NOW",
                },
                {
                  label: "Learn More",
                  url: "/more",
                  labelKey: "LEARN_MORE",
                },
                {
                  label: "API Details",
                  url: "/api",
                  labelKey: "API_DETAILS",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      stepId: "12",
      prevStepId: "11",
      nextStepId: "13",
      stepType: "STATIC",
      stepName: "MANAGE_SHIPPER",
      headerLabelKey: "HEADER_MANAGE_SHIPPER",
      headerLabel: "Add and manage shippers",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [
        {
          type: "Image",
          description: `<div>
            <p>A shipper is your client who can raise order requests to transport their own customers’ orders. The LogiNext platform offers a dedicated Shipper Web App for your shippers to create order requests. Alternatively, you can create order requests on a shipper’s behalf. You can add shippers in 3 ways:</p>
            <ul>
              <li>
                1. Filling out the Add Shipper form
              </li>
              <li>
                2. Uploading an Excel file containing shippers’ details
              </li>
              <li>
                3. Using the Create Shipper API
              </li>
              <li>
                4. Approving a Shipper Request
              </li>
            </ul>
          </div>`,
          descriptionKey: "ONBOARD_SHIPPER_DESCRIPTION",
          titleKey: "ONBOARD_SHIPPER_TITLE",
          title: "Onboard your shippers",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
        {
          type: "Image",
          description: `<div>
            <p>Service Area Profiles let you define location serviceability for your shippers. You can map a Service Area Profile to specific shippers to ensure they only raise serviceable order requests.</p>
          </div>`,
          descriptionKey: "SETUP_LOCATION_DESCRIPTION",
          title: "Set up location serviceability checks",
          titleKey: "SETUP_LOCATION_TITLE",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
        {
          type: "Image",
          description: `<div>
            <p>Shipper Rate Charts let you determine the costs of fulfilling your shippers' orders. A Shipper Rate Chart can constitute multiple parameters that shall be added up to calculate the total cost charged. You can create as many Shipper Rate Charts as necessary and map them to relevant shippers.</p>
          </div>`,
          descriptionKey: "ORDER_FULLFILLEMENT_DESCRIPTION",
          title: "Specify order fulfillment costs",
          titleKey: "ORDER_FULLFILLEMENT_TITLE",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
      ],
      subSteps: [],
    },
    {
      stepId: "13",
      prevStepId: "11",
      nextStepId: "14",
      stepType: "STATIC",
      stepName: "MANAGE_CARRIER",
      headerLabelKey: "HEADER_MANAGE_CARRIER",
      headerLabel: "Add and manage carriers",
      isCompleted: false, //set true from post api
      status: "UNVISITED",
      selected: false,
      weightage: 10,
      templates: [
        {
          type: "Image",
          description: `<div>
            <p>A shipper is your client who can raise order requests to transport their own customers’ orders. The LogiNext platform offers a dedicated Shipper Web App for your shippers to create order requests. Alternatively, you can create order requests on a shipper’s behalf. You can add shippers in 3 ways:</p>
            <ul>
              <li>
                1. Filling out the Add Shipper form
              </li>
              <li>
                2. Uploading an Excel file containing shippers’ details
              </li>
              <li>
                3. Using the Create Shipper API
              </li>
              <li>
                4. Approving a Shipper Request
              </li>
            </ul>
          </div>`,
          descriptionKey: "ONBOARD_SHIPPER_DESCRIPTION",
          titleKey: "ONBOARD_SHIPPER_TITLE",
          title: "Onboard your shippers",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
        {
          type: "Image",
          description: `<div>
            <p>Service Area Profiles let you define location serviceability for your shippers. You can map a Service Area Profile to specific shippers to ensure they only raise serviceable order requests.</p>
          </div>`,
          descriptionKey: "SETUP_LOCATION_DESCRIPTION",
          title: "Set up location serviceability checks",
          titleKey: "SETUP_LOCATION_TITLE",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
        {
          type: "Image",
          description: `<div>
            <p>Shipper Rate Charts let you determine the costs of fulfilling your shippers' orders. A Shipper Rate Chart can constitute multiple parameters that shall be added up to calculate the total cost charged. You can create as many Shipper Rate Charts as necessary and map them to relevant shippers.</p>
          </div>`,
          descriptionKey: "ORDER_FULLFILLEMENT_DESCRIPTION",
          title: "Specify order fulfillment costs",
          titleKey: "ORDER_FULLFILLEMENT_TITLE",
          icon: "",
          videoUrl: "",
          buttons: [
            {
              label: "Try Now",
              url: "/try",
              labelKey: "TRY_NOW",
            },
            {
              label: "Learn More",
              url: "/more",
              labelKey: "LEARN_MORE",
            },
            {
              label: "API Details",
              url: "/api",
              labelKey: "API_DETAILS",
            },
          ],
        },
      ],
      subSteps: [],
    },
    // {
    //   stepId:"14,
    //   prevStepId: "13",
    //   nextStepId: "15",
    //   stepType: "STATIC",
    //   stepName: "Form and list builder",
    //   headerLabelKey: "HEADER_MANAGE_CARRIER",
    //   headerLabel: "Form and List Builder",
    // },
  ],
};
