<?php

require_once __DIR__ . "/../utils/Response.php";

class Router
{
    private $routes = [
        "GET" => [],
        "POST" => [],
        "PUT" => [],
        "DELETE" => []
    ];

    public function get($path, $handler)
    {
        $this->routes["GET"][$path] = $handler;
    }

    public function post($path, $handler)
    {
        $this->routes["POST"][$path] = $handler;
    }

    public function put($path, $handler)
    {
        $this->routes["PUT"][$path] = $handler;
    }

    public function delete($path, $handler)
    {
        $this->routes["DELETE"][$path] = $handler;
    }

    public function run($db)
    {
        $method = $_SERVER["REQUEST_METHOD"];
        $uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

        // Normalize URL (remove trailing slash)
        if ($uri !== "/" && substr($uri, -1) === "/") {
        $uri = rtrim($uri, "/");
        }

        if (isset($this->routes[$method][$uri])) {
        [$controllerClass, $methodName] = $this->routes[$method][$uri];

        $controller = new $controllerClass($db);
        return $controller->$methodName();
        }

        Response::json(404, "Route not found: $method $uri");
    }

}
