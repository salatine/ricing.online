terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~> 3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "d8bd1f02-8f3c-497b-8104-48a24c869300"
}

resource "azurerm_resource_group" "ricing_online" {
  name = "ricingOnlineRG"
  location = "Central US"
}

resource "azurerm_service_plan" "ricing_online_plan" {
  name                = "webapp-asp-ricingOnline"
  location            = azurerm_resource_group.ricing_online.location
  resource_group_name = azurerm_resource_group.ricing_online.name
  os_type = "Linux"
  sku_name = "S1"
}

resource "azurerm_linux_web_app" "ricing_online_webapp" {
  name                = "webapp-ricingOnline"
  location            = azurerm_resource_group.ricing_online.location
  resource_group_name = azurerm_resource_group.ricing_online.name
  service_plan_id = azurerm_service_plan.ricing_online_plan.id
  https_only = true
  site_config {
    minimum_tls_version = "1.2"
  }
}
