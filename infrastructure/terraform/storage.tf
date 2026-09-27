resource "random_string" "storage_suffix" {
  length  = 8
  special = false
  upper   = false
}


resource "azurerm_storage_account" "main" {
  name = "mdproduct${random_string.storage_suffix.result}"

  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location

  account_tier             = "Standard"
  account_replication_type = "LRS"

  min_tls_version = "TLS1_2"

  public_network_access = "Disabled"

  allow_nested_items_to_be_public = false

  tags = local.common_tags
}


resource "azurerm_storage_container" "product_documents" {
  name = "product-documents"

  storage_account_id = azurerm_storage_account.main.id

  container_access_type = "private"
}