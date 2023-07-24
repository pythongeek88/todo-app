# Use an official Python runtime as a base image
FROM python:3.9

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container to /backend
WORKDIR /backend

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the code
COPY . .

# Copy entrypoint script into the image and make it executable
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose the port server is running on
EXPOSE 8000

# Use the entrypoint script as the main command
ENTRYPOINT [ "./entrypoint.sh", "python", "manage.py", "runserver", "0.0.0.0:8000" ]
