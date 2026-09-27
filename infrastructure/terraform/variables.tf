variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Existing Azure Resource Group"
  type        = string
}

variable "vnet_address_space" {
  description = "VNet address space"
  type        = list(string)
}

variable "app_subnet_address_prefix" {
  description = "Subnet for App Service VNet integration"
  type        = list(string)
}

variable "private_endpoint_subnet_address_prefix" {
  description = "Subnet for Private Endpoints"
  type        = list(string)
}

variable "apim_subnet_address_prefix" {
  description = "Subnet for APIM VNet integration"
  type        = list(string)
}

variable "sql_admin_username" {
  description = "SQL administrator username"
  type        = string
  sensitive   = true
}

variable "ghcr_username" {
  description = "GitHub username that owns the GHCR packages (e.g. ziyasalar)"
  type        = string
}

variable "ghcr_token" {
  description = "GitHub PAT with read:packages scope, used by App Service to pull private GHCR images"
  type        = string
  sensitive   = true
}

variable "product_image_tag" {
  description = "Tag of the product-api image to deploy"
  type        = string
  default     = "latest"
}

variable "shipment_image_tag" {
  description = "Tag of the shipment-api image to deploy"
  type        = string
  default     = "latest"
}

variable "inventory_image_tag" {
  description = "Tag of the inventory-api image to deploy"
  type        = string
  default     = "latest"
}

variable "static_web_app_location" {
  description = "Region for the Static Web App (only a subset of Azure regions support this service, e.g. West US 2, Central US, East US 2, West Europe, East Asia)"
  type        = string
  default     = "westus2"
}