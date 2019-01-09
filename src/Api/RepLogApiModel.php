<?php

namespace App\Api;

/**
 * Class RepLogApiModel
 */
class RepLogApiModel
{
    public $id;

    public $reps;

    public $itemLabel;

    public $totalWeightLifted;

    private $links = [];

    /**
     * @param $ref
     * @param $url
     */
    public function addLink($ref, $url)
    {
        $this->links[$ref] = $url;
    }

    /**
     * @return array
     */
    public function getLinks()
    {
        return $this->links;
    }
}
