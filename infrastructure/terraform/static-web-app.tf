resource "azurerm_static_web_app" "frontend" {
  name = "${local.name_prefix}-frontend"

  resource_group_name = data.azurerm_resource_group.main.name
  # Static Web Apps are only available in a handful of regions - override with
  # var.static_web_app_location if your resource group's region isn't one of them.
  location = var.static_web_app_location

  sku_tier = "Free"
  sku_size = "Free"

  tags = local.common_tags
}