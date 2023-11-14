/**
 * 
 */

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.5.0"
    }
  }
}

# Neccesaries values
variable "github_repo_url" {
    type = string
}

variable "github_token_runner" {
    type = string
} 

data "template_file" "startup_script" {
  template = "${file("./install.sh")}"
  vars = {
    github_repo_url = var.github_repo_url
    github_token_runner = var.github_token_runner
  }
}

# Va
provider "google" {
  credentials = file("~/.config/gcloud/application_default_credentials.json")
  project     = "terraform-405014"
  region      = "us-central1"
  zone        = "us-central1-c"
}

# Network
resource "google_compute_network" "vpc_network" {
  name                    = "my-custom-mode-network"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_subnetwork" "default" {
  name          = "my-custom-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = "us-west1"
  network       = google_compute_network.vpc_network.id
}

# Create a single Compute Engine instance
resource "google_compute_instance" "default" {
  # Este puede ser el la unica variable por reposigorio
  name = "runner-cliente1"
  # gcloud compute machine-types list --project=[project-name] --filter=guestCpus=8
  machine_type              = "c2d-highmem-8"
  zone                      = "us-west1-a"
  tags                      = ["terrafrom", "ssh"]
  allow_stopping_for_update = true # neccesary to change machine_type
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
   
  metadata_startup_script = "${data.template_file.startup_script.rendered}"

  network_interface {
    subnetwork = google_compute_subnetwork.default.id

    access_config {
      # Include this section to give the VM an external IP address
    }
  }
}


# Firewall
resource "google_compute_firewall" "ssh" {
  name = "allow-ssh"
  allow {
    ports    = ["22"]
    protocol = "tcp"
  }
  direction     = "INGRESS"
  network       = google_compute_network.vpc_network.id
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ssh"]
}
