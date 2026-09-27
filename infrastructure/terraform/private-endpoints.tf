resource "azurerm_private_endpoint" "product" {
  name = "pe-product-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  subnet_id = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name = "psc-product-api"

    private_connection_resource_id = azurerm_linux_web_app.product.id

    is_manual_connection = false

    subresource_names = [
      "sites"
    ]
  }

  private_dns_zone_group {
    name = "product-dns"

    private_dns_zone_ids = [
      azurerm_private_dns_zone.webapps.id
    ]
  }

  tags = local.common_tags
}


resource "azurerm_private_endpoint" "shipment" {
  name = "pe-shipment-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  subnet_id = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name = "psc-shipment-api"

    private_connection_resource_id = azurerm_linux_web_app.shipment.id

    is_manual_connection = false

    subresource_names = [
      "sites"
    ]
  }

  private_dns_zone_group {
    name = "shipment-dns"

    private_dns_zone_ids = [
      azurerm_private_dns_zone.webapps.id
    ]
  }

  tags = local.common_tags
}


resource "azurerm_private_endpoint" "inventory" {
  name = "pe-inventory-api"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  subnet_id = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name = "psc-inventory-api"

    private_connection_resource_id = azurerm_linux_web_app.inventory.id

    is_manual_connection = false

    subresource_names = [
      "sites"
    ]
  }

  private_dns_zone_group {
    name = "inventory-dns"

    private_dns_zone_ids = [
      azurerm_private_dns_zone.webapps.id
    ]
  }

  tags = local.common_tags
}


resource "azurerm_private_dns_zone" "webapps" {
  name = "privatelink.azurewebsites.net"

  resource_group_name = data.azurerm_resource_group.main.name

  tags = local.common_tags
}


resource "azurerm_private_dns_zone_virtual_network_link" "webapps" {
  name = "webapps-dns-link"

  private_dns_zone_id = azurerm_private_dns_zone.webapps.id

  virtual_network_id = azurerm_virtual_network.main.id

  registration_enabled = false

  tags = local.common_tags
}


resource "azurerm_private_endpoint" "storage_blob" {
  name = "pe-storage-blob"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  subnet_id = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name = "psc-storage-blob"

    private_connection_resource_id = azurerm_storage_account.main.id

    is_manual_connection = false

    subresource_names = [
      "blob"
    ]
  }

  private_dns_zone_group {
    name = "storage-blob-dns"

    private_dns_zone_ids = [
      azurerm_private_dns_zone.blob.id
    ]
  }

  tags = local.common_tags
}


resource "azurerm_private_dns_zone" "blob" {
  name = "privatelink.blob.core.windows.net"

  resource_group_name = data.azurerm_resource_group.main.name

  tags = local.common_tags
}


resource "azurerm_private_dns_zone_virtual_network_link" "blob" {
  name = "blob-dns-link"

  private_dns_zone_id = azurerm_private_dns_zone.blob.id

  virtual_network_id = azurerm_virtual_network.main.id

  registration_enabled = false

  tags = local.common_tags
}