resource "aws_instance" "web" {
    # Debian 12 (20231013-1532).
    # https://wiki.debian.org/Cloud/AmazonEC2Image/Bookworm
    ami                         = "ami-058bd2d568351da34"
    instance_type               = "t3.micro"
    associate_public_ip_address = true
    # Instal apache after init instance
    user_data = file("bootstrap.sh")

    tags = {
        Name = "HelloWorld"
    }
}
