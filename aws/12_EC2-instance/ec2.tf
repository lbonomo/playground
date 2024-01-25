# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance

resource "aws_instance" "web_example" {
  # Debian 12 (20231013-1532).
  # https://wiki.debian.org/Cloud/AmazonEC2Image/Bookworm
  ami                         = "ami-058bd2d568351da34"
  instance_type               = "t3.micro"
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.public_subnet.id
  security_groups             = [aws_security_group.web_example.id]
  key_name                    = aws_key_pair.deployer.key_name
  # Instal apache after init instance
  user_data = file("bootstrap.sh")

  tags = {
    Name = "Terraform Apache example"
  }
}


resource "aws_key_pair" "deployer" {
  key_name   = "web_example"
  public_key = file("id_rsa.pub")
}
