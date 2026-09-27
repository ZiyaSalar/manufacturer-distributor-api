resource "azurerm_service_plan" "api" {
  name = "${local.name_prefix}-api-plan"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  os_type  = "Linux"
  sku_name = "P1v3"

  tags = local.common_tags
}


resource "azurerm_linux_web_app" "product" {
  name = "${local.name_prefix}-product-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  # APIM (StandardV2) is not VNet-injected, so it reaches this app over the
  # public endpoint. We lock that endpoint down to only APIM's outbound IPs.
  public_network_access_enabled = true

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      docker_image_name   = "${var.ghcr_username}/product-api:${var.product_image_tag}"
      docker_registry_url = "https://ghcr.io"

      docker_registry_username = var.ghcr_username
      docker_registry_password = var.ghcr_token
    }

    dynamic "ip_restriction" {
      for_each = azurerm_api_management.main.public_ip_addresses
      content {
        ip_address = "${ip_restriction.value}/32"
        action      = "Allow"
        priority    = 100 + index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)
        name        = "apim-${index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)}"
      }
    }
  }

  app_settings = {
    NODE_ENV      = "production"
    WEBSITES_PORT = "3001"
  }

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "shipment" {
  name = "${local.name_prefix}-shipment-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  public_network_access_enabled = true

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      docker_image_name   = "${var.ghcr_username}/shipment-api:${var.shipment_image_tag}"
      docker_registry_url = "https://ghcr.io"

      docker_registry_username = var.ghcr_username
      docker_registry_password = var.ghcr_token
    }

    dynamic "ip_restriction" {
      for_each = azurerm_api_management.main.public_ip_addresses
      content {
        ip_address = "${ip_restriction.value}/32"
        action      = "Allow"
        priority    = 100 + index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)
        name        = "apim-${index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)}"
      }
    }
  }

  app_settings = {
    NODE_ENV      = "production"
    WEBSITES_PORT = "3002"
  }

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "inventory" {
  name = "${local.name_prefix}-inventory-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  service_plan_id = azurerm_service_plan.api.id

  https_only = true

  public_network_access_enabled = true

  virtual_network_subnet_id = azurerm_subnet.app_integration.id

  site_config {
    always_on = true

    application_stack {
      docker_image_name   = "${var.ghcr_username}/inventory-api:${var.inventory_image_tag}"
      docker_registry_url = "https://ghcr.io"

      docker_registry_username = var.ghcr_username
      docker_registry_password = var.ghcr_token
    }

    dynamic "ip_restriction" {
      for_each = azurerm_api_management.main.public_ip_addresses
      content {
        ip_address = "${ip_restriction.value}/32"
        action      = "Allow"
        priority    = 100 + index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)
        name        = "apim-${index(azurerm_api_management.main.public_ip_addresses, ip_restriction.value)}"
      }
    }
  }

  app_settings = {
    NODE_ENV      = "production"
    WEBSITES_PORT = "3003"
  }

  tags = local.common_tags
}