
resource "aws_vpc" "web_example" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = "true" #gives you an internal domain name
  enable_dns_hostnames = "true" #gives you an internal host name
  // enable_classiclink   = "false"
  instance_tenancy     = "default"
  tags = {
    Name = "web_example"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.web_example.id

  tags = {
    Name = "web_example"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.web_example.id
  cidr_block        = var.public_subnet_cidr
  map_public_ip_on_launch = true

  tags = {
    Name = "web_example"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.web_example.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public_rt"
  }
}

resource "aws_route_table_association" "public_rt_asso" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}
