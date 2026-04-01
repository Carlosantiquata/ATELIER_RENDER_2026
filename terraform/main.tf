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

# ─── FLASK WEB SERVICE ───────────────────────────────────────────────────────

resource "render_web_service" "flask_app" {
  name   = "flask-render-iac-${var.github_actor}"
  plan   = "free"
  region = "frankfurt"

  runtime_source = {
    image = {
      # On sépare l'URL et le tag pour respecter les nouvelles règles du provider Render
      image_url = var.image_url
      tag       = var.image_tag
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
      # On sépare également pour Adminer
      image_url = "adminer"
      tag       = "latest"
    }
  }

  env_vars = {
    ADMINER_DEFAULT_SERVER = {
      # ⚠️ RAPPEL : Remets bien ici l'URL de ta base de données PostgreSQL !
      value = "dpg-d76ivrua2pns73eph8dg-a.frankfurt-postgres.render.com"  
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
