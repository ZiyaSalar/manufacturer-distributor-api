resource "azurerm_api_management" "main" {
  name = "${local.name_prefix}-apim"

  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name

  publisher_name  = "Manufacturer Distributor"
  publisher_email = "admin@example.com"

  sku_name = "StandardV2_1"

  public_network_access_enabled = true

  tags = local.common_tags
}

# ---------------------------------------------------------------------------
# Backends: one per containerized service
# ---------------------------------------------------------------------------

resource "azurerm_api_management_backend" "product" {
  name                = "product-api-backend"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  protocol = "http"
  url      = "https://${azurerm_linux_web_app.product.default_hostname}"

  tls {
    validate_certificate_chain = true
    validate_certificate_name  = true
  }
}

resource "azurerm_api_management_backend" "shipment" {
  name                = "shipment-api-backend"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  protocol = "http"
  url      = "https://${azurerm_linux_web_app.shipment.default_hostname}"

  tls {
    validate_certificate_chain = true
    validate_certificate_name  = true
  }
}

resource "azurerm_api_management_backend" "inventory" {
  name                = "inventory-api-backend"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  protocol = "http"
  url      = "https://${azurerm_linux_web_app.inventory.default_hostname}"

  tls {
    validate_certificate_chain = true
    validate_certificate_name  = true
  }
}

# ---------------------------------------------------------------------------
# APIs: one per service, published under /product, /shipment, /inventory
# ---------------------------------------------------------------------------

resource "azurerm_api_management_api" "product" {
  name                = "product-api"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  revision     = "1"
  display_name = "Product API"
  path         = "product"
  protocols    = ["https"]

  subscription_required = false
}

resource "azurerm_api_management_api_operation" "product_passthrough" {
  operation_id        = "product-passthrough"
  api_name            = azurerm_api_management_api.product.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  display_name = "Passthrough"
  method       = "*"
  url_template = "/*"
}

resource "azurerm_api_management_api_policy" "product" {
  api_name            = azurerm_api_management_api.product.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service backend-id="${azurerm_api_management_backend.product.name}" />
    <rewrite-uri template="@(context.Request.OriginalUrl.Path.Replace("/product",""))" copy-unmatched-params="true" />
  </inbound>
  <backend><base /></backend>
  <outbound><base /></outbound>
  <on-error><base /></on-error>
</policies>
XML
}

resource "azurerm_api_management_api" "shipment" {
  name                = "shipment-api"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  revision     = "1"
  display_name = "Shipment API"
  path         = "shipment"
  protocols    = ["https"]

  subscription_required = false
}

resource "azurerm_api_management_api_operation" "shipment_passthrough" {
  operation_id        = "shipment-passthrough"
  api_name            = azurerm_api_management_api.shipment.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  display_name = "Passthrough"
  method       = "*"
  url_template = "/*"
}

resource "azurerm_api_management_api_policy" "shipment" {
  api_name            = azurerm_api_management_api.shipment.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service backend-id="${azurerm_api_management_backend.shipment.name}" />
    <rewrite-uri template="@(context.Request.OriginalUrl.Path.Replace("/shipment",""))" copy-unmatched-params="true" />
  </inbound>
  <backend><base /></backend>
  <outbound><base /></outbound>
  <on-error><base /></on-error>
</policies>
XML
}

resource "azurerm_api_management_api" "inventory" {
  name                = "inventory-api"
  resource_group_name = data.azurerm_resource_group.main.name
  api_management_name = azurerm_api_management.main.name

  revision     = "1"
  display_name = "Inventory API"
  path         = "inventory"
  protocols    = ["https"]

  subscription_required = false
}

resource "azurerm_api_management_api_operation" "inventory_passthrough" {
  operation_id        = "inventory-passthrough"
  api_name            = azurerm_api_management_api.inventory.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  display_name = "Passthrough"
  method       = "*"
  url_template = "/*"
}

resource "azurerm_api_management_api_policy" "inventory" {
  api_name            = azurerm_api_management_api.inventory.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = data.azurerm_resource_group.main.name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service backend-id="${azurerm_api_management_backend.inventory.name}" />
    <rewrite-uri template="@(context.Request.OriginalUrl.Path.Replace("/inventory",""))" copy-unmatched-params="true" />
  </inbound>
  <backend><base /></backend>
  <outbound><base /></outbound>
  <on-error><base /></on-error>
</policies>
XML
}