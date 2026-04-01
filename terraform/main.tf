terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = ">= 1.7.0"
    }
  }
}

provider "render" {
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}

# ─── VARIABLES ───────────────────────────────────────────────────────────────

variable "render_api_key" {
  description = "Clé API Render"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Owner ID Render"
  type        = string
}

variable "database_url" {
  description = "URL de connexion PostgreSQL"
  type        = string
  sensitive   = true
}

variable "image_url" {
  description = "URL de l'image Docker (injectée par la CI)"
  type        = string
}

variable "image_tag" {
  description = "Tag de l'image Docker (injectée par la CI)"
  type        = string
}

variable "github_actor" {
  description = "GitHub username"
  type        = string
}

# ─── FLASK WEB SERVICE ───────────────────────────────────────────────────────

resource "render_web_service" "flask_app" {
  name   = "flask-render-iac-${var.github_actor}"
  plan   = "free"
  region = "frankfurt"

  runtime_source = {
    image = {
      image_url = "${var.image_url}:${var.image_tag}"
    }
  }

  env_vars = {
    ENV = {
      value = "production"
    }
    DATABASE_URL = {
      value = var.database_url
    }
  }
}

# ─── ADMINER WEB SERVICE ─────────────────────────────────────────────────────

resource "render_web_service" "adminer" {
  name   = "adminer-iac-${var.github_actor}"
  plan   = "free"
  region = "frankfurt" 

  runtime_source = {
    image = {
      image_url = "adminer:latest"
    }
  }

  env_vars = {
    ADMINER_DEFAULT_SERVER = {
      # ⚠️ RAPPEL : Remplace cette valeur par le hostname de ton PostgreSQL 
      # (ex: dpg-xxxx.frankfurt-postgres.render.com)
      value = "dpg-d76ivrua2pns73eph8dg-a"  
    }
  }
}

# ─── OUTPUTS ─────────────────────────────────────────────────────────────────

output "flask_url" {
  description = "URL publique du backend Flask"
  value       = render_web_service.flask_app.url
}

output "adminer_url" {
  description = "URL publique d'Adminer"
  value       = render_web_service.adminer.url
}
